
var File = require("fs")
// MongoDB
var DbConnection = require('./XL_KET_NOI');

function Doc_Thong_tin_Dich_vu() {
    var Duong_dan = "index.html"
    var Chuoi_Thong_tin = File.readFileSync(Duong_dan, "UTF-8")
    return Chuoi_Thong_tin
}


class XL_LUU_TRU {
    Doc_Thong_tin_Dich_vu(){
      return Doc_Thong_tin_Dich_vu()
    }
  
    async Doc_Thong_tin_Cua_hang() {
      try {
        var db = await DbConnection.Get()
        var Cua_hang = await db.collection("Cua_Hang").find({}).toArray()
        return Cua_hang
      } catch (Loi) {
        console.log(Loi)
      }
    }
    async Doc_Thong_tin_Nguoi_dung() {
      try {
        var db = await DbConnection.Get();
        var Nguoi_dung = await db.collection("Nguoi_dung").find({}).toArray()
        return Nguoi_dung
      } catch (Loi) {
        console.log(Loi)
      }
    }
    async  Doc_Danh_sach_Tivi() {
      try {
        var db = await DbConnection.Get()
        var San_pham = await db.collection("San_Pham").find({}).toArray()
        return San_pham
      } catch (Loi) {
        console.log(Loi)
      }
    }
    async  Ghi_moi_Doi_tuong(Loai_Doi_tuong, Doi_tuong) {
      try {
        var db = await DbConnection.Get()
        var Kq = await db.collection(Loai_Doi_tuong).insert(Doi_tuong)
        return Kq
  
      } catch (Loi) {
        console.log(Loi)
      }
    }
    async Cap_nhat_Doi_tuong(Loai_Doi_tuong, Bieu_thuc_dieu_kien, Gia_tri_Cap_nhat) {
      try {
        var db = await DbConnection.Get()
  
        var Kq = await db.collection(Loai_Doi_tuong).updateOne(Bieu_thuc_dieu_kien, Gia_tri_Cap_nhat)
  
        return Kq
  
      } catch (Loi) {
        console.log(Loi);
      }
    }
    async  Xoa_Doi_tuong(Loai_Doi_tuong, Bieu_thuc_dieu_kien) {
      try {
        var db = await DbConnection.Get()
        var Kq = await db.collection(Loai_Doi_tuong).deleteOne(Bieu_thuc_dieu_kien);
        return Kq
      } catch (Loi) {
        console.log(Loi);
      }
    }
  }
  
  
  
  //Public để các file js khác gọi 
  var Xu_ly = new XL_LUU_TRU
  module.exports = Xu_ly
  
