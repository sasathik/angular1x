namespace MyApp.DataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class AppEvent
    {
        [Key]
        public int EventID { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(200)]
        public string Description { get; set; }

        public DateTime StartAt { get; set; }

        public DateTime? EndAt { get; set; }

        public bool IsFullDay { get; set; }
    }
}
