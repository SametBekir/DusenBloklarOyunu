namespace DusenBloklarOyunu.Services
{
    public class SavePlayerService
    {
        private readonly YourDbContext _context;

        // Veritabanı bağlamını enjekte et
        public SavePlayerService(YourDbContext context)
        {
            _context = context;
        }

        // Oyuncu kaydetme işlemi
        public void UserKayit(string username, int userPuan)
        {
            var player = new Player
            {
                Username = username,
                Puan = userPuan,
                DateCreated = DateTime.Now
            };

            _context.Players.Add(player);
            _context.SaveChanges();
        }
    }

    public class Player
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int Puan { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
