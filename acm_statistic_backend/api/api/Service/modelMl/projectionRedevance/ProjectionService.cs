using api.ModelML.projection_future_redevance;
using Microsoft.EntityFrameworkCore;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Trainers.FastTree;
using Microsoft.ML.Transforms;
namespace api.Service.modelMl.projectionRedevance
{
    public class ProjectionService
    {
        private readonly MLContext _mlContext;
        public ProjectionService(MLContext mlContext)
        {
            _mlContext = mlContext;
        }

        
        public IDataView LoadData(string path)
        {
            return _mlContext.Data.LoadFromTextFile<ModelRedevanceCsv>(
                path: path,
                hasHeader: true,
                separatorChar: ',');
        }
        public List<ModelRedevance> FeatureEngineeringList(List<ModelRedevanceCsv> rowsCsv)
        {
            var rows = new List<ModelRedevance>();

            for (int i = 0; i < rowsCsv.Count; i++)
            {
                var csv = rowsCsv[i];

                var newRow = new ModelRedevance
                {
                    Annee = csv.Annee,
                    Mois = csv.Mois,
                    Redevances = csv.Redevances,
                    Trimestre = (csv.Mois - 1) / 3 + 1,
                    SinMois = (float)Math.Sin(2 * Math.PI * csv.Mois / 12),
                    CosMois = (float)Math.Cos(2 * Math.PI * csv.Mois / 12),
                    //RedevancesLag1 = i > 0 ? rowsCsv[i - 1].Redevances : 0f
                };

                rows.Add(newRow);
            }

            return rows;

        }


        public List<ModelRedevance> FeatureEngineering(IDataView data)
        {
            var rowsCsv = _mlContext.Data.CreateEnumerable<ModelRedevanceCsv>(data, reuseRowObject: false).ToList();
            var rows = new List<ModelRedevance>();

            for (int i = 0; i < rowsCsv.Count; i++)
            {
                var csv = rowsCsv[i];

                var newRow = new ModelRedevance
                {
                    Annee = csv.Annee,
                    Mois = csv.Mois,
                    Redevances = csv.Redevances,
                    Trimestre = (csv.Mois - 1) / 3 + 1,
                    SinMois = (float)Math.Sin(2 * Math.PI * csv.Mois / 12),
                    CosMois = (float)Math.Cos(2 * Math.PI * csv.Mois / 12),
                    //RedevancesLag1 = i > 0 ? rowsCsv[i - 1].Redevances : 0f
                };

                rows.Add(newRow);
            }

            return rows;
        }


        public static List<float> Generate(float[] features, int maxDegree = 2)
        {
            var polyFeatures = new List<float>();

            for (int degree = 2; degree <= maxDegree; degree++)
            {
                Combine(features, degree, 0, new List<int>(), polyFeatures);
            }

            return polyFeatures;
        }

        private static void Combine(float[] features, int degree, int start, List<int> indices, List<float> result)
        {
            if (indices.Count == degree)
            {
                // Multiplie toutes les features choisies
                float prod = 1f;
                foreach (var i in indices)
                    prod *= features[i];
                result.Add(prod);
                return;
            }

            for (int i = start; i < features.Length; i++)
            {
                indices.Add(i);
                Combine(features, degree, i + 1, indices, result);
                indices.RemoveAt(indices.Count - 1);
            }
        }
        int Combinations(int n, int r)
        {
            int res = 1;
            for (int i = 0; i < r; i++)
            {
                res *= (n - i);
                res /= (i + 1);
            }
            return res;
        }
        public  List<ModelRedevance> GeneratePolynomialFeatures(List<ModelRedevance> data, int maxDegree = 2)
        {
            int nBase = 5; // nombre de features de base
            int nPoly = 0;

            // calculer la taille totale du vecteur polynômial
            for (int d = 2; d <= maxDegree; d++)
            {
                nPoly += Combinations(nBase, d);
            }
            foreach (var row in data)
            {
                var baseFeatures = new float[]
                {
                row.Annee,
                row.Mois,
                row.Trimestre,
                row.SinMois,
                row.CosMois,
                };

                var poly = Generate(baseFeatures, maxDegree).ToArray();

                row.PolyFeatures = new float[nPoly];
                Array.Copy(poly, row.PolyFeatures, poly.Length);
            }

            return data;
        }


        public ITransformer TrainModel(List<ModelRedevance> data)
        {
            var dataView = _mlContext.Data.LoadFromEnumerable(data);

            var pipeline = _mlContext.Transforms.Concatenate("Features", "PolyFeatures")
                .Append(_mlContext.Transforms.NormalizeRobustScaling("Features"))
                .Append(_mlContext.Regression.Trainers.FastForest(new FastForestRegressionTrainer.Options
                {
                    NumberOfTrees = 271,
                    MinimumExampleCountPerLeaf = 1,
                    NumberOfLeaves = 64, 
                    FeatureFraction = 0.5f, 
                    LabelColumnName = "Redevances",
                    FeatureColumnName = "Features"
                }));

            return pipeline.Fit(dataView);
        }

        
        public float Predict(ITransformer model, ModelRedevance sample)
        {
            var engine = _mlContext.Model.CreatePredictionEngine<ModelRedevance, Prediction>(model);
            var prediction = engine.Predict(sample);
            return prediction.RedevancesPred;
        }
        public void SaveModel(ITransformer model, string filePath, DataViewSchema schema)
        {
            
            _mlContext.Model.Save(model, schema, filePath);
        }
        public ITransformer LoadModel(string filePath, out DataViewSchema schema)
        {
            return _mlContext.Model.Load(filePath, out schema);
        }

        public void EntrainementSauvegard()
        {
            string projectRoot = Directory.GetParent(AppContext.BaseDirectory).Parent.Parent.Parent.FullName;
            string filePath = Path.Combine(projectRoot, "donnees", "redevances_mois_genere.csv");
            var dataView = LoadData(filePath);


            var features = FeatureEngineering(dataView);
            var polyFeatures = GeneratePolynomialFeatures(features);


            var model = TrainModel(polyFeatures);


            string outputDir = AppContext.BaseDirectory;

            string modelPath = Path.Combine(outputDir, "modelRedevance.zip");
            SaveModel(model, modelPath, _mlContext.Data.LoadFromEnumerable(polyFeatures).Schema);

        }
        public List<ModelRedevanceCsv> loadPredict(int annee)
        {
            var inputData = new List<ModelRedevanceCsv>();
            for (int mois = 1; mois <= 12; mois++)
            {
                inputData.Add(new ModelRedevanceCsv
                {
                    Annee = annee,
                    Mois = mois,
                    Redevances = 0f // on met 0 car ce sera prédit
                });
            }

            // Convertir en ModelRedevance avec feature engineering
            var features = FeatureEngineeringList(inputData);
            var polyFeatures = GeneratePolynomialFeatures(features);

            // Charger le modèle sauvegardé
            string projectRoot = AppContext.BaseDirectory;
            string modelPath = Path.Combine(projectRoot, "modelRedevance.zip");
            DataViewSchema schema;
            var model = LoadModel(modelPath, out schema);

            // Générer les prédictions pour chaque mois
            var predictions = polyFeatures.Select(p => new ModelRedevanceCsv
            {
                Annee = p.Annee,
                Mois = p.Mois,
                Redevances = Predict(model, p) // mettre la prédiction ici
            }).ToList();

            // Retourner la liste
            return predictions;
        }
    }

}

