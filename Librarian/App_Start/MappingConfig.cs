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

            Mapper.CreateMap<Data.Patron, Models.Patron>().ForMember(model => model.PatronType,
                map => map.MapFrom(data => new Models.Lookup(data.LU_PatronType, Caching.GetLookup("PatronType")[data.LU_PatronType]))) ;
            Mapper.CreateMap<Models.Patron, Data.Patron>().ForMember(data => data.LU_PatronType,
                map => map.MapFrom(model => model.PatronType.Value));
        }

    }
}