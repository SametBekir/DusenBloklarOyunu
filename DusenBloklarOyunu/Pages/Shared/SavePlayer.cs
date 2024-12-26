using Microsoft.Data.SqlClient; // SQL bağlantısı için gerekli kütüphane
using System;
using System.Data;

namespace DusenBloklarOyunu.Pages.Shared
{
    public class SavePlayer
    {
        // SqlConnection nesnesi oluşturun
        private static SqlConnection connection = new SqlConnection("Data Source=SAMETBEKIR\\SQLEXPRESS;Initial Catalog=tempdb;Integrated Security=True;Encrypt=False");

        // Bağlantı kontrolü yapan metod
        public static void CheckConnection()
        {
            try
            {
                // Eğer bağlantı kapalıysa aç
                if (connection.State == ConnectionState.Closed)
                {
                    connection.Open();
                }
            }
            catch (Exception ex)
            {
                // Hata oluşursa konsola yazdırabilir veya loglayabilirsiniz
                Console.WriteLine("Bağlantı hatası: " + ex.Message);
            }
        }

        // Kullanıcıyı veritabanına kaydetme fonksiyonu
        public static void userkayit(string username, int userPuan)
        {
            try
            {
                // Bağlantı açılmadan önce bağlantının açık olup olmadığını kontrol et
                CheckConnection();

                // SQL Insert komutunu oluştur
                string query = "INSERT INTO Users (Username, UserPuan) VALUES (@Username, @UserPuan)";

                // SqlCommand nesnesi oluştur
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Parametreler ile SQL komutunu koru (SQL Injection'dan kaçınmak için)
                    command.Parameters.AddWithValue("@Username", username);
                    command.Parameters.AddWithValue("@UserPuan", userPuan);

                    // Sorguyu çalıştır ve veriyi kaydet
                    int rowsAffected = command.ExecuteNonQuery();

                    // Başarıyla kaydedildiyse
                    if (rowsAffected > 0)
                    {
                        Console.WriteLine("Oyuncu başarıyla kaydedildi.");
                    }
                    else
                    {
                        Console.WriteLine("Kullanıcı kaydedilemedi.");
                    }
                }
            }
            catch (Exception ex)
            {
                // Hata mesajını konsola yazdır
                Console.WriteLine("Kullanıcı kaydederken bir hata oluştu: " + ex.Message);
            }
            finally
            {
                // Bağlantıyı kapat
                CloseConnection();
            }
        }

        // Bağlantıyı kapatmak için bir yöntem
        public static void CloseConnection()
        {
            try
            {
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Bağlantı kapatılırken bir hata oluştu: " + ex.Message);
            }
        }
    }
}
