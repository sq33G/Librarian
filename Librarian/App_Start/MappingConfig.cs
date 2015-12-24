using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Librarian;

namespace Librarian
{
    public class MappingConfig
    {
        public static void RegisterMappings()
        {
            Mapper.CreateMap<Data.Author, Models.Author>();
            Mapper.CreateMap<Models.Author, Data.Author>();

            Mapper.CreateMap<Data.Publisher, Models.Publisher>();
            Mapper.CreateMap<Models.Publisher, Data.Publisher>();
        }

    }
}