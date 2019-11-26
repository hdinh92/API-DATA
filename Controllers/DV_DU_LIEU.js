var NodeJs_Dich_vu = require("http")
var Port = normalizePort(process.env.PORT || 1000);
var Xu_ly_Tham_so = require('querystring')
var Luu_tru=require("../Models/XL_LUU_TRU")
var Goi_thu = require("../Models/XL_SendMail")

var Du_lieu = {}


var Danh_sach_Tivi = Luu_tru.Doc_Danh_sach_Tivi()
var Cua_hang = Luu_tru.Doc_Thong_tin_Cua_hang()
var Nguoi_dung = Luu_tru.Doc_Thong_tin_Nguoi_dung()

Danh_sach_Tivi.then(Kq => {
  Du_lieu.Danh_sach_Tivi = Kq
})
Cua_hang.then(Kq => {
  Du_lieu.Cua_hang = Kq[0]
})
Nguoi_dung.then(Kq => {
  Du_lieu.Nguoi_dung = Kq
})


var Dich_vu = NodeJs_Dich_vu.createServer((Yeu_cau, Dap_ung) => {
  var Chuoi_Nhan = ""
  var Dia_chi_Xu_ly = Yeu_cau.url.replace("/", "")
  Yeu_cau.on('data', (chunk) => { Chuoi_Nhan += chunk })
  Yeu_cau.on('end', () => {
    Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
    Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    Dap_ung.setHeader('Access-Control-Allow-Credentials', true);
    var Tham_so = Xu_ly_Tham_so.parse(Dia_chi_Xu_ly.replace("?", ""))
    var Ma_so_Xu_ly = Tham_so.Ma_so_Xu_ly
    var Chuoi_Kq = ""
    if (Ma_so_Xu_ly == "DOC_DANH_SACH_TIVI") {
      var Danh_sach_Tivi = {}
      Danh_sach_Tivi = Du_lieu.Danh_sach_Tivi
      Chuoi_Kq = JSON.stringify(Danh_sach_Tivi)
      Dap_ung.end(Chuoi_Kq);
    }else if (Ma_so_Xu_ly == "DOC_CUA_HANG") {
      var Cua_hang = {}
      Cua_hang = Du_lieu.Cua_hang
      Chuoi_Kq = JSON.stringify(Cua_hang)
      Dap_ung.end(Chuoi_Kq);
    }
    else if (Ma_so_Xu_ly == "GOI_THU_LIEN_HE") {
      var from = "mephim2804@gmail.com"
      var to = "ffchi01@gmail.com"
      var subject = "Khách hàng Liên hệ"
      var body = Chuoi_Nhan
      var kqPromise = Goi_thu.Goi_Thu_Lien_he(from, to, subject, body)
      console.log(kqPromise)
      kqPromise.then(result => {
        console.log(result)
        Chuoi_Kq = "OK"
        Dap_ung.end(Chuoi_Kq);
      }).catch(Loi=>{
        Chuoi_Kq = "ERROR"
        console.log(Loi)
        Dap_ung.end(Chuoi_Kq);
      })
    }else if (Ma_so_Xu_ly == "Ghi_Tivi_Moi") {
      var San_Pham = JSON.parse(Chuoi_Nhan)
      var Kq = Luu_tru.Ghi_moi_Doi_tuong("San_Pham", San_Pham)
      Kq.then(result => {
        //console.log(result)
        Du_lieu.Danh_sach_Tivi.push(San_Pham)
        Chuoi_Kq = JSON.stringify(San_Pham)
        Dap_ung.end(Chuoi_Kq);
      }).catch(err => {
        Chuoi_Kq = "Error"
        Dap_ung.end(Chuoi_Kq);
      })
    }else if (Ma_so_Xu_ly == "Ghi_Phieu_Dat_hang") {
      var Kq = "OK"
      let dsDathang = JSON.parse(Chuoi_Nhan)
      console.log(dsDathang)
      dsDathang.forEach(San_Pham_Mua => {
        var San_Pham = Du_lieu.Danh_sach_Tivi.find(x => x.Ma_so == San_Pham_Mua.San_Pham.Ma_so)
        var So_Phieu_Dat = San_Pham.Danh_sach_Phieu_Dat.length + 1
        San_Pham_Mua.Phieu_Dat.So_Phieu_Dat = So_Phieu_Dat
        San_Pham.Danh_sach_Phieu_Dat.push(San_Pham_Mua.Phieu_Dat)
        var Dieu_kien = { "Ma_so": San_Pham_Mua.San_Pham.Ma_so }
        var Gia_tri_Cap_nhat = {
          $set: { Danh_sach_Phieu_Dat: San_Pham.Danh_sach_Phieu_Dat }
        }
        Kq = Luu_tru.Cap_nhat_Doi_tuong("San_Pham", Dieu_kien, Gia_tri_Cap_nhat)
        Kq.then(result => {
          console.log(result)
          Chuoi_Kq = "OK"
          Dap_ung.end(Chuoi_Kq);
        })
      })
    } else if (Ma_so_Xu_ly == "Dang_nhap") {
      var Nguoi_dung_DN = JSON.parse(Chuoi_Nhan)
      let Thong_bao = {
        "Noi_dung": false
      }
      let Nguoi_dung = Du_lieu.Nguoi_dung.find(x => x.Ten_Dang_nhap == Nguoi_dung_DN.Ten_Dang_nhap && x.Mat_khau == Nguoi_dung_DN.Mat_khau)
      if (Nguoi_dung) {
        Thong_bao = {
          "Noi_dung": { "Ten": Nguoi_dung.Ten, "Nhom_Nguoi_dung": Nguoi_dung.Nhom_Nguoi_dung }
        }
      }
      Chuoi_Kq = JSON.stringify(Thong_bao)
      Dap_ung.end(Chuoi_Kq);
    } else {
      Chuoi_Kq = Luu_tru.Doc_Thong_tin_Dich_vu()
      Dap_ung.end(Chuoi_Kq);
    }
  })
})




Dich_vu.listen(Port,
  console.log(`Dịch vụ Dữ liệu đang thực thi tại địa chỉ: http://localhost:${Port}`)
);

Dich_vu.on('error', onError);
Dich_vu.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof Port === 'string'
        ? 'Pipe ' + Port
        : 'Port ' + Port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = Dich_vu.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}