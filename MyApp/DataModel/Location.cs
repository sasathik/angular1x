namespace MyApp.DataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Location
    {
        public int LocationID { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(10)]
        public string Lat { get; set; }

        [Required]
        [StringLength(10)]
        public string Long { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(200)]
        public string ImagePath { get; set; }
    }
}
