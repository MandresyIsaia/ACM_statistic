using api.Model.exploitants;
using api.ModelML.anomalie_redevance_compagnie.modelAnomalieCsv;
using api.ModelML.anomalie_redevance_compagnie.modelBaseAnomalie;
using api.ModelML.anomalie_redevance_compagnie.VecteurGaussienne;
using api.ModelML.preprocessing.standarScaler;
using api.ModelML.projection_future_redevance;
using api.Service.modelMl.Standardisation;
using MathNet.Numerics.LinearAlgebra;
using MathNet.Numerics.LinearAlgebra.Double;
using Microsoft.ML;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api.Service.modelMl.anomalieRedevanceCompagnie
{
    public class AnomalieRedevanceCompagnieService
    {
        private readonly MLContext _mlContext = new MLContext();
        public List<ModelAnomalieBase> loadPredict(List<ModelAnomalieBase> data)
        {
            if (data.Count == 0) {
                return data;
            }
            EncodageLoad(data);
            List<float[]> X_scaled = StandardizeData(data);


            string outputDir = AppContext.BaseDirectory;
            string pdfParamsPath = Path.Combine(outputDir, "pdfParamsCompagnie.json");
            List<double> pdfValues = VecteurGaussienne.ComputePDF(X_scaled, pdfParamsPath);


            string thresholdPath = Path.Combine(outputDir, "thresholdCompagnie.json");
            List<bool> anomalies = VecteurGaussienne.DetectAnomaliesByPDF(pdfValues, thresholdPath);
            List<ModelAnomalieBase> modelRedevanceDTOs = new List<ModelAnomalieBase>();
            for (int i = 0; i < anomalies.Count; i++)
            {
                if (anomalies[i])
                {
                    modelRedevanceDTOs.Add(data[i]);
                }
            }
            return modelRedevanceDTOs;

        }

        public void trainSave(List<ModelAnomalieBase> data, List<Exploitant> exploitants)
        {
            Exploitant.EncodageSave(exploitants);
            EncodageLoad(data);
            

            List<float[]> X_scaled = StandardizeData(data);

            string outputDir = AppContext.BaseDirectory;
            string pdfParamsPath = Path.Combine(outputDir, "pdfParamsCompagnie.json");
            List<double> pdfValues = VecteurGaussienne.GetPdfParmas(X_scaled, pdfParamsPath);

            string thresholdPath = Path.Combine(outputDir, "thresholdCompagnie.json");
            VecteurGaussienne.GetThreshold(pdfValues, 0.01, thresholdPath);

        }
        private static List<float[]> StandardizeData(List<ModelAnomalieBase> data)
        {
            
            var numericData = data.Select(d => new float[]
            {
                d.Annee,
                d.Mois,
                d.compagnieEncoder.HasValue ? d.compagnieEncoder.Value : 0f,
                d.Redevances
            }).ToList();

            var scaler = new StandardScaler();

            
             numericData = scaler.FitTransform(numericData);
             
            return numericData;
        }

        public List<ModelAnomalieBase> LoadDataAsList(string path)
        {
            var dataView = _mlContext.Data.LoadFromTextFile<ModelAnomalieCsv>(
                path: path,
                hasHeader: true,
                separatorChar: ',');


            var dataEnumerable = _mlContext.Data.CreateEnumerable<ModelAnomalieCsv>(
                dataView,
                reuseRowObject: false);


            var dtoList = dataEnumerable.Select(d => new ModelAnomalieBase
            {
                Annee = d.Annee,
                Mois = d.Mois,
                Compagnies = d.Compagnies,
                Redevances = d.Redevances
            }).ToList();

            return dtoList;
        }
        
        private static void EncodageLoad(List<ModelAnomalieBase> data)
        {
            if (data == null || data.Count == 0)
                return;


            var encoder = new LabelEncoder();

            string outputDir = AppContext.BaseDirectory;
            string encoderPath = Path.Combine(outputDir, "compagnie_mapping.json");
            encoder.Load(encoderPath);
            

            var compagnies = data.Select(x => x.Compagnies).ToList();


            var compagniesEncoded = encoder.Transform(compagnies);


            


            for (int i = 0; i < data.Count; i++)
            {
                data[i].compagnieEncoder = compagniesEncoded[i];
            }

        }

    }
}
