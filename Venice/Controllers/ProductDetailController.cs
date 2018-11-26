using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Venice.Models;
using Venice.Utility;
using static System.Net.Mime.MediaTypeNames;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Venice.Controllers
{
    [Route("api/[controller]")]
    public class ProductDetailController : Controller
    {
        /*
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductDetailController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        */
        private readonly VeniceDbContext _context;

        public ProductDetailController(VeniceDbContext context)
        {
            _context = context;
        }


        [HttpPost("[action]")]
        public IActionResult UploadJustFile(IFormCollection form)
        {
            try
            {

                List<ProductImage> productImages = HttpContext.Session.GetObjectFromJson<List<ProductImage>>("ProductionImages") ?? new List<ProductImage>();
                var imageStream = UploadFile(form.Files[0]);

                ProductImage newProductImage = new ProductImage();
                newProductImage.strImageType = form.Files[0].ContentType;
                newProductImage.strImageUrl = "data:" + form.Files[0].ContentType + ";base64," + Convert.ToBase64String(imageStream.ToArray(), 0, imageStream.ToArray().Length);
                newProductImage.Data = imageStream.ToArray();
                newProductImage.IsPrimaryImage = true;

                productImages.Add(newProductImage);
                HttpContext.Session.SetObjectAsJson("ProductionImages", productImages);

                return base.Json(newProductImage);
            }
            catch (Exception ex)
            {
                return null;
            }
        }



        [HttpGet("[action]")]
        public IActionResult getImages()
        {
            List<ProductImage> productImages = HttpContext.Session.GetObjectFromJson<List<ProductImage>>("ProductionImages") ?? new List<ProductImage>();
            return Json(productImages);
        }


        [HttpPost("[action]")]
        public dynamic InsertProduct(IFormCollection form)
        {
            try
            {
                Product product = MapFormCollectionToProduct(form);
                foreach (var file in form.Files)
                {
                    UploadFile(file);
                }
                return new { Success = true };
            }
            catch (Exception ex)
            {
                return new { Success = false, ex.Message };
            }
        }


        private MemoryStream UploadFile(IFormFile image)
        {

            if (image == null || image.Length == 0)
                throw new Exception("File is empty!");
            byte[] fileArray;

            var memoryStream = new MemoryStream();
            using (var stream = image.OpenReadStream())
            {
                stream.CopyTo(memoryStream);
                fileArray = memoryStream.ToArray();
            }

            return memoryStream;
            //TODO: You can do it what you want with you file, I just skip this step
        }

        private Product MapFormCollectionToProduct(IFormCollection form)
        {
            var product = new Product();
            string productName = "productName";
            string productDetail = "productDetail";
            string aditionalInformation = "aditionalInformation";
            string price = "price";
            if (form.Any())
            {
                if (form.Keys.Contains(productDetail))
                    product.ProductDetail = form[productDetail];
                if (form.Keys.Contains(aditionalInformation))
                    product.AditionalInformation = form[aditionalInformation];
                if (form.Keys.Contains(price))
                    product.Price = Convert.ToDecimal(form[price]);
                if (form.Keys.Contains(productName))
                    product.ProductName = form[productName];

                Category category = new Category();
                category.CategoryName = "Sunflower";
                category.CategoryDisplayName = "Sunflower";

               

                _context.Categories.Add(category);
                _context.SaveChanges();

                Unit unit = new Unit();
                unit.UnitName = "Packet";
                unit.QuantiryPerUnit = 1;

                _context.Units.Add(unit);
                _context.SaveChanges();
                product.CategoryId = _context.Categories.OrderByDescending(it => it.Id).Select(it=>it.Id).FirstOrDefault();
                product.UnitId = _context.Units.OrderByDescending(it => it.Id).Select(it => it.Id).FirstOrDefault();
                product.MinStockQuantity = 10;

                

                List<ProductImage> productImages = HttpContext.Session.GetObjectFromJson<List<ProductImage>>("ProductionImages") ?? new List<ProductImage>();

                foreach (ProductImage img in productImages) {
                    product.ProductImage.Add(img);
                }
                _context.Products.Add(product);
                _context.SaveChanges();

            }
            return product;
        }

        [HttpGet]
        public FileStreamResult ViewImage(Guid id)
        {
            /*
            MemoryStream ms = new MemoryStream(image.Data);

            return new FileStreamResult(ms, image.ContentType);
            */
            return null;
        }
    }

}
