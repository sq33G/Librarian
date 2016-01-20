using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Librarian
{
    public static class SerializingConfig
    {
        public static void RegisterSerializerSettings()
        {
            JsonConvert.DefaultSettings = GetSettings;
        }

        private static JsonSerializerSettings GetSettings()
        {
            JsonSerializerSettings s = new JsonSerializerSettings();
            s.Converters.Add(new EscapeQuoteConverter());

            return s;
        }

        private class EscapeQuoteConverter : JsonConverter
        {
            public override bool CanConvert(Type objectType)
            {
                return objectType == typeof(string);
            }

            public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
            {
                string value = JToken.Load(reader).Value<string>();
                return value.Replace("&quot;", "'");
            }

            public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
            {
                writer.WriteValue(((string)value).Replace("'", "&apos;"));
            }
        }
    }
}