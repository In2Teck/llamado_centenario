class UserMailer < ActionMailer::Base
  default from: "info@josecuervoespecial.com.mx"
  
  def send_win_notification user
    @user = user
    attachments["boleto_centenario.png"] = File.read("#{Rails.root}/app/assets/images/mobile/boleto_centenario.png")
    mail(:to => user.email, :subject => "Felicidades! Has ganado un boleto")
  end

end
