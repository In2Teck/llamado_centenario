# encoding: UTF-8
class UserMailer < ActionMailer::Base
  
  def send_win_notification user
    @user = user
    attachments["boleto_centenario.png"] = File.read("#{Rails.root}/app/assets/images/mobile/boleto_centenario.png")
    mail(:to => user.email, :subject => "¡FELICIDADES estás MÁS CERCA DEL CIELO!", :from => "\"Tequila Centenario\" <info@centenario.com>")
  end

end
