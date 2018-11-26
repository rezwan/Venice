using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Venice.Models
{
    public partial class ProductImage
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        [NotMapped]
        public String strImageUrl { get; set; }
        [NotMapped]
        public String strImageType { get; set; }
        public bool IsPrimaryImage { get; set; }
        public byte[] Data { get; set; }

        public Product Product { get; set; }
    }
}
