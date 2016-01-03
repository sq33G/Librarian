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

            Mapper.CreateMap<Data.Edition, Models.Edition>();
            Mapper.CreateMap<Models.Edition, Data.Edition>();

            CreateMapForPatron();

            CreateMapForItem();
        }

        private static void CreateMapForPatron()
        {
            Mapper.CreateMap<Data.Patron, Models.Patron>()
                .ForMember(model => model.PatronType,
                           map => map.MapFrom(data => new Models.Lookup(data.LU_PatronType, Caching.GetLookup("PatronType")[data.LU_PatronType])));

            Mapper.CreateMap<Models.Patron, Data.Patron>()
                .ForMember(data => data.LU_PatronType,
                           map => map.MapFrom(model => model.PatronType.Value));
        }

        private static void CreateMapForItem()
        {
            Mapper.CreateMap<Data.Item, Models.Item>()
                .ForMember(model => model.AuthorsDesc,
                           map => map.MapFrom(data => String.Join(",", data.Authors.Select((auth, i) => i == 0 ? auth.ToAlphebetizable() : auth.ToString()))))
                .ForMember(model => model.CopiesCount,
                           map => map.MapFrom(data => data.Editions.SelectMany(e => e.Copies).Count()))
                .ForMember(model => model.EditionsCount,
                           map => map.MapFrom(data => data.Editions.Count()))
                .ForMember(model => model.Location,
                           map => map.MapFrom(data => new Models.Lookup(data.Location, Caching.GetLookup("Location")[data.Location])))
                .ForMember(model => model.MediaType,
                           map => map.MapFrom(data => new Models.Lookup(data.MediaTypeID, Caching.GetMediaType(data.MediaTypeID))))
                .ForMember(model => model.ReservesCount,
                           map => map.MapFrom(data => data.Reserves.Count))
                .ForMember(model => model.Subjects,
                           map => map.MapFrom(data => data.ItemSubjects.Select(s => new Models.Lookup(s.LU_Subject, Caching.GetLookup("Subject")[s.LU_Subject]))));

            Mapper.CreateMap<Models.Item, Data.Item>()
                .ForMember(data => data.MediaTypeID,
                           map => map.MapFrom(model => model.MediaType.Value))
                .ForMember(data => data.ItemSubjects,
                           map => map.MapFrom(model => model.Subjects.Select(s => new Data.ItemSubject { ItemID = model.ID, LU_Subject = s.Value })))
                .ForMember(data => data.Location,
                           map => map.MapFrom(model => model.Location.Value));

        }
    }
}