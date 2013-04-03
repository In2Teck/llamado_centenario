class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  
	def facebook
		@user = User.find_for_facebook_oauth(auth_hash, current_user)
    signed_request = params[:signed_request]
		if @user.persisted?
			#flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
			sign_in @user
      redirect_to "/?signed_request=" + signed_request
		else
			session["devise.facebook_data"] = auth_hash.except("extra")
			redirect_to signup_url(@user)
		end
	end

	def auth_hash
		request.env["omniauth.auth"]
	end
end
