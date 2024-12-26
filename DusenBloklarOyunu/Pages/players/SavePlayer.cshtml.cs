using Microsoft.AspNetCore.Mvc;
using DusenBloklarOyunu.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DusenBloklarOyunu.Pages.Shared
{
    public class SavePlayerModel : PageModel
    {
        private readonly SavePlayerService _savePlayerService;

        // SavePlayerService'i enjekte et
        public SavePlayerModel(SavePlayerService savePlayerService)
        {
            _savePlayerService = savePlayerService;
        }

        // Veriyi al ve kaydet
        public IActionResult OnPostUserkayit([FromBody] PlayerData playerData)
        {
            if (ModelState.IsValid)
            {
                _savePlayerService.UserKayit(playerData.Username, playerData.UserPuan);
                return new JsonResult(new { message = "Oyuncu başarıyla kaydedildi." });
            }

            return BadRequest("Geçersiz veri.");
        }
    }

    public class PlayerData
    {
        public string Username { get; set; }
        public int UserPuan { get; set; }
    }
}
