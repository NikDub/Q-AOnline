using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using QandAOnline.Models;

namespace QandAOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        ApplicationContext db;
        public ProductController(ApplicationContext context)
        {
            db = context;
        }
       
        [HttpGet]
        public IEnumerable<QuestAndAnswer> Get()
        {
            return db.questionAndAnswers;
        }

        [HttpGet("{id}")]
        public QuestAndAnswer Get(int id)
        {
            QuestAndAnswer product = db.questionAndAnswers.FirstOrDefault(x => x.Id == id);
            return product;
        }

        [HttpGet("question/{some}")]
        public IEnumerable<QuestAndAnswer> Get(string some)
        {
            if(some== "withoutAnswer")
                return db.questionAndAnswers.Where(e => e.Answer == null || e.Answer == "");
            if(some == "withAnswerOnly")
                return db.questionAndAnswers.Where(e => e.Answer != null && e.Answer != "");
            return db.questionAndAnswers;
        }

        [HttpPost]
        public IActionResult Post(QuestAndAnswer product)
        {
            if (ModelState.IsValid)
            {
                db.questionAndAnswers.Add(product);
                db.SaveChanges();
                return Ok(product);
            }
            return BadRequest(ModelState);
        }

        [HttpPut]
        public IActionResult Put(QuestAndAnswer product)
        {
            if (ModelState.IsValid)
            {
                db.Update(product);
                db.SaveChanges();
                return Ok(product);
            }
            return BadRequest(ModelState);
        }
    }
}