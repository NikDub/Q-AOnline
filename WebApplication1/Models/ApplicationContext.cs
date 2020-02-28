using Microsoft.EntityFrameworkCore;

namespace QandAOnline.Models
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        { }

        public DbSet<QuestAndAnswer> questionAndAnswers { get; set; }
    }
}
