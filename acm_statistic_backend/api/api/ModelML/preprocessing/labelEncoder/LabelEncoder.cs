using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

public class LabelEncoder
{
    private Dictionary<string, int> labelToInt = new Dictionary<string, int>();
    private Dictionary<int, string> intToLabel = new Dictionary<int, string>();

    // Nettoie un label (trim + éventuellement minuscules)
    private string CleanLabel(string label) => label?.Trim().ToUpper() ?? "";

    public List<int> FitTransform(List<string> labels)
    {
        return labels.Select(FitTransform).ToList();
    }

    public int FitTransform(string label)
    {
        label = CleanLabel(label);

        if (!labelToInt.ContainsKey(label))
        {
            int newId = labelToInt.Count;
            labelToInt[label] = newId;
            intToLabel[newId] = label;
        }
        return labelToInt[label];
    }

    public int Transform(string label)
    {
        label = CleanLabel(label);

        if (!labelToInt.ContainsKey(label))
            throw new Exception($"Label inconnu : '{label}'");
        return labelToInt[label];
    }

    public List<int> Transform(List<string> labels)
    {
        return labels.Select(Transform).ToList();
    }

    public string InverseTransform(int value)
    {
        if (!intToLabel.ContainsKey(value))
            throw new Exception($"Valeur inconnue : {value}");
        return intToLabel[value];
    }

    public List<string> InverseTransform(List<int> values)
    {
        return values.Select(InverseTransform).ToList();
    }

    public Dictionary<string, int> GetMapping() => new Dictionary<string, int>(labelToInt);

    public void Save(string filePath)
    {
        var json = JsonSerializer.Serialize(labelToInt, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(filePath, json);
    }

    public void Load(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Fichier introuvable : {filePath}");

        labelToInt = JsonSerializer.Deserialize<Dictionary<string, int>>(File.ReadAllText(filePath))
                     ?? new Dictionary<string, int>();
        intToLabel = labelToInt.ToDictionary(kvp => kvp.Value, kvp => kvp.Key);
    }
}
