using api.ModelML.projection_future_redevance;
using api.Service.modelMl.Standardisation;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using Microsoft.ML;
using static api.ModelML.projection_future_redevance.PredictionRedevanceAnomalie;

namespace api.Service.modelMl.anomalieRedevance
{
    public class AnomalieRedevanceService
    {
        private readonly MLContext _mlContext = new MLContext();
        private readonly StandardisationRedevanceService _standardisationRedevanceService;
        
        
        public AnomalieRedevanceService(StandardisationRedevanceService standardisationRedevanceService)
        {
            _standardisationRedevanceService = standardisationRedevanceService;
        }
        public void trainSave(List<ModelRedevanceDTO> data)
        {
            
            List<float[]> X_scaled = _standardisationRedevanceService.FitTransform(data);
            //foreach (var x in X_scaled) {
            //    for (int i = 0; i < x.Length; i++) { 
            //        Console.Write(", " + x[i]);
            //    }
            //    Console.WriteLine();
            //}
            string outputDir = AppContext.BaseDirectory;
            string pdfParamsPath = Path.Combine(outputDir, "pdfParams.json");
            List<double> pdfValues = GetPdfParmas(X_scaled,pdfParamsPath);

            string thresholdPath = Path.Combine(outputDir, "threshold.json");
            GetThreshold(pdfValues, 0.05,thresholdPath);

        }
        public List<ModelRedevanceDTO> loadPredict(List<ModelRedevanceDTO> data)
        {
            List<float[]> X_scaled = _standardisationRedevanceService.FitTransform(data);

            string outputDir = AppContext.BaseDirectory;
            string pdfParamsPath = Path.Combine(outputDir, "pdfParams.json");
            List<double> pdfValues = ComputePDF(X_scaled, pdfParamsPath);
            //foreach (double value in pdfValues) { 
            //    Console.WriteLine(value);
            //}
            string thresholdPath = Path.Combine(outputDir, "threshold.json");
            List<bool> anomalies = DetectAnomaliesByPDF(pdfValues, thresholdPath);
            List<ModelRedevanceDTO> modelRedevanceDTOs = new List<ModelRedevanceDTO>();
            for (int i = 0; i < anomalies.Count; i++) {
                if (anomalies[i]) { 
                    modelRedevanceDTOs.Add(data[i]);
                }
            }
            return modelRedevanceDTOs;
        }
        public List<ModelRedevanceDTO> LoadDataAsList(string path)
        {
            var dataView = _mlContext.Data.LoadFromTextFile<ModelRedevanceCsv>(
                path: path,
                hasHeader: true,
                separatorChar: ',');

            
            var dataEnumerable = _mlContext.Data.CreateEnumerable<ModelRedevanceCsv>(
                dataView,
                reuseRowObject: false);

            
            var dtoList = dataEnumerable.Select(d => new ModelRedevanceDTO
            {
                Annee = d.Annee,
                Mois = d.Mois,
                Redevances = d.Redevances
            }).ToList();

            return dtoList;
        }
        
        private static Vector<double> ComputeMean(Matrix<double> X)
        {
            int d = X.ColumnCount;
            // Crée explicitement un DenseVector<double>
            var mu = DenseVector.Create(d, 0.0);

            for (int j = 0; j < d; j++)
                mu[j] = X.Column(j).Average();

            return mu;
        }
        private static Matrix<double> ComputeCovariance(Matrix<double> X, Vector<double> mu)
        {
            int n = X.RowCount;
            int d = X.ColumnCount;
            var cov = DenseMatrix.Create(d, d, 0.0);

            for (int i = 0; i < d; i++)
            {
                for (int j = 0; j <= i; j++)
                {
                    double cov_ij = 0.0;
                    for (int k = 0; k < n; k++)
                        cov_ij += (X[k, i] - mu[i]) * (X[k, j] - mu[j]);
                    cov_ij /= (n - 1);
                    cov[i, j] = cov_ij;
                    cov[j, i] = cov_ij; // symétrique
                }
            }

            return cov;
        }
        private static List<double> ComputePDF(Matrix<double> X, Vector<double> mu, Matrix<double> cov)
        {
            int n = X.RowCount;
            int d = X.ColumnCount;

            var covInv = cov.Inverse();
            double det = cov.Determinant();
            double denom = Math.Sqrt(Math.Pow(2 * Math.PI, d) * det);

            var pdf = new List<double>(n);
            for (int k = 0; k < n; k++)
            {
                var x = DenseVector.OfArray(X.Row(k).ToArray());
                var diff = x - mu;
                double exponent = -0.5 * diff * covInv * diff;
                pdf.Add(Math.Exp(exponent) / denom);
            }

            return pdf;
        }
        private static List<double> GetPdfParmas(List<float[]> Xlist, string paramFile = null)
        {
            int n = Xlist.Count;
            if (n == 0) return new List<double>();
            int d = Xlist[0].Length;


            var X = DenseMatrix.OfRows(n, d, Xlist.Select(r => r.Select(v => (double)v)));
            Vector<double> mu=  ComputeMean(X);
            Matrix<double> cov = ComputeCovariance(X, mu);


            if (paramFile != null)
                GaussianParameters.SaveGaussianParameters(mu, cov, paramFile);
            var pdfValues = ComputePDF(X, mu, cov);
            return pdfValues;
        }


        private static List<double> ComputePDF(List<float[]> Xlist, string paramFile = null)
        {
            int n = Xlist.Count;
            if (n == 0) return new List<double>();
            int d = Xlist[0].Length;

            
            var X = DenseMatrix.OfRows(n, d, Xlist.Select(r => r.Select(v => (double)v)));

            Vector<double> mu;
            Matrix<double> cov;

            GaussianParameters.LoadGaussianParameters(paramFile, out mu, out cov);
            
            var pdfValues = ComputePDF(X, mu, cov);
            return pdfValues;
        }
        private static void GetThreshold(List<double> pdfValues, double quantile = 0.05, string thresholdFile = null)
        {
            int n = pdfValues.Count;


            double threshold;
            var sorted = pdfValues.OrderBy(x => x).ToList();
            int index = (int)Math.Floor(n * quantile);
            threshold = sorted[Math.Min(index, n - 1)];

            if (thresholdFile != null)
                PdfThreshold.SaveThreshold(threshold, thresholdFile);
        }
        private static List<bool> DetectAnomaliesByPDF(List<double> pdfValues, string thresholdFile = null)
        {
            int n = pdfValues.Count;

            double threshold;
            threshold = PdfThreshold.LoadThreshold(thresholdFile);
            
            var anomalies = pdfValues.Select(x => x <= threshold).ToList();
            return anomalies;
        }
        

    }
}
