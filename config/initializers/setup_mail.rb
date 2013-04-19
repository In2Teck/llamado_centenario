ActionMailer::Base.smtp_settings = {
  :address              => "smtp.gmail.com",
  :port                 => 587,
  :domain               => "josecuervoespecial.com.mx",
  :user_name            => "info@josecuervoespecial.com.mx",
  :password             => "",
  :authentication       => "plain",
  :enable_starttls_auto => true
}
