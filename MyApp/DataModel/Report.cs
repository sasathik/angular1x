namespace MyApp.DataModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Report
    {
        [Key]
        public int EmployeeID { get; set; }

        [Required]
        [StringLength(30)]
        public string LastName { get; set; }

        [Required]
        [StringLength(30)]
        public string FirstName { get; set; }

        [StringLength(30)]
        public string Title { get; set; }

        [StringLength(30)]
        public string TitleOfCourtesy { get; set; }

        public DateTime? BirthDate { get; set; }

        [StringLength(30)]
        public string HomePhone { get; set; }

        public int ReportsTo { get; set; }
    }
}
