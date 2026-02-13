using api.ModelML.projection_future_redevance;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;

namespace api.ModelML.anomalie_redevance_compagnie.VecteurGaussienne
{
    public class VecteurGaussienne
    {
        public static Vector<double> ComputeMean(Matrix<double> X)
        {
            int d = X.ColumnCount;
            // Crée explicitement un DenseVector<double>
            var mu = DenseVector.Create(d, 0.0);

            for (int j = 0; j < d; j++)
                mu[j] = X.Column(j).Average();

            return mu;
        }
        public static Matrix<double> ComputeCovariance(Matrix<double> X, Vector<double> mu)
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
        public static List<double> ComputePDF(Matrix<double> X, Vector<double> mu, Matrix<double> cov)
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
        public static List<double> GetPdfParmas(List<float[]> Xlist, string paramFile = null)
        {
            int n = Xlist.Count;
            if (n == 0) return new List<double>();
            int d = Xlist[0].Length;


            var X = DenseMatrix.OfRows(n, d, Xlist.Select(r => r.Select(v => (double)v)));
            Vector<double> mu = ComputeMean(X);
            Matrix<double> cov = ComputeCovariance(X, mu);


            if (paramFile != null)
                GaussianParameters.SaveGaussianParameters(mu, cov, paramFile);
            var pdfValues = ComputePDF(X, mu, cov);
            return pdfValues;
        }


        public static List<double> ComputePDF(List<float[]> Xlist, string paramFile = null)
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
        public static void GetThreshold(List<double> pdfValues, double quantile = 0.05, string thresholdFile = null)
        {
            int n = pdfValues.Count;


            double threshold;
            var sorted = pdfValues.OrderBy(x => x).ToList();
            int index = (int)Math.Floor(n * quantile);
            threshold = sorted[Math.Min(index, n - 1)];

            if (thresholdFile != null)
                PdfThreshold.SaveThreshold(threshold, thresholdFile);
        }
        public static List<bool> DetectAnomaliesByPDF(List<double> pdfValues, string thresholdFile = null)
        {
            int n = pdfValues.Count;

            double threshold;
            threshold = PdfThreshold.LoadThreshold(thresholdFile);

            var anomalies = pdfValues.Select(x => x <= threshold).ToList();
            return anomalies;
        }
    }
}
