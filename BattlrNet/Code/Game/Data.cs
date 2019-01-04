using System;
using System.Collections.Generic;
using System.Globalization;

namespace BattlrNet.Code.Game
{
    public static class Data
    {
        private static readonly Random random = new Random();
        private static readonly TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

        public static string GetRandomName()
        {
            //return $"{ToUpperFirst(Utilities.GetRandomListItem(Adjectives))} {ToUpperFirst(Utilities.GetRandomListItem(Nouns))}";
            return textInfo.ToTitleCase($"{Utilities.GetRandomListItem(Adjectives)} {Utilities.GetRandomListItem(Nouns)}");
        }

        private static string ToUpperFirst(string val)
        {
            return $"{char.ToUpper(val[0])}{val.Substring(1)}";
        }

        public static readonly List<string> Adjectives = new List<string>()
        {
            "attractive", "beautiful", "clean", "dazzling", "elegant", "fancy", "fit", "glamorous", "gorgeous", "handsome", "magnificent",
            "ashy", "black", "blue", "gray", "green", "icy", "lemon", "mango", "orange", "purple", "red", "salmon", "white",
            "yellow", "careful", "clever", "famous", "gifted", "helpful", "important", "odd", "powerful", "agreeable", "ambitious",
            "brave", "calm", "delightful", "eager", "faithful", "gentle", "happy", "jolly", "kind", "lively", "nice", "polite",
            "proud", "silly", "thankful", "victorious", "witty", "wonderful", "zealous", "mysterious", "thoughtful", "crashing",
            "deafening", "echoing", "faint", "harsh", "hissing", "howling", "loud", "melodic", "noisy", "quiet", "rapping", "raspy",
            "rhythmic", "screeching", "shrilling", "squeaking", "thundering", "tinkling", "wailing", "whining", "whispering"
        };

        public static readonly List<string> Nouns = new List<string>()
        {
            "chin", "clam", "class", "clover", "club", "corn", "crayon", "crow", "crown", "crowd", "crib", "desk", "dime", "dirt",
            "dress", "fang ", "field", "flag", "flower", "fog", "game", "heat", "hill", "home", "horn", "hose", "joke", "juice",
            "kite", "lake", "maid", "mask", "mice", "milk", "mint", "meal", "meat", "moon", "mother", "morning", "name", "nest",
            "nose", "pear", "pen", "pencil", "plant", "rain", "river", "road", "rock", "room", "rose", "seed", "shape", "shoe",
            "shop", "show", "sink", "snail", "snake", "snow", "soda", "sofa", "star", "step", "stew", "stove", "straw", "string",
            "summer", "swing", "table", "tank", "team", "tent", "test", "toes", "tree", "vest", "water", "wing", "winter", "actor",
            "airplane", "airport", "army", "baseball", "beef", "birthday", "boy", "brush", "bushes", "butter ", "cast", "cave", "cent",
            "cherries", "cherry", "cobweb", "coil", "cracker", "dinner", "eggnog", "elbow", "face", "fireman", "flavor", "gate", "glove",
            "glue", "goldfish", "goose", "grain", "hair", "haircut", "hobbies", "holiday", "hot", "jellyfish", "ladybug", "mailbox",
            "number", "oatmeal", "pail", "pancake", "pear", "pest", "popcorn", "queen", "quicksand", "quiet", "quilt", "rainstorm",
            "scarecrow", "scarf", "stream", "street", "sugar", "throne", "toothpaste", "twig", "volleyball", "wood", "wrench",
            "apple", "arm", "banana", "bike", "bird", "book"
        };
    }
}
