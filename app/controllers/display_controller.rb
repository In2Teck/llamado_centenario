class DisplayController < ApplicationController

  #before_filter :authenticate_user!

  def index
    @signed_request = params[:signed_request]
    @app_data = (decode_data @signed_request)["app_data"] if not @signed_request.blank?
	end

  def search_clue
    @is_clue_active = false
  end

  def invite_friends
    
  end

  

  def parse_signed_request
    @signed_request = decode_data(params[:signed_request])
    respond_to do |format|
      format.json { render json: @signed_request}
    end
  end
  
  protected

  def base64_url_decode str
    encoded_str = str.gsub('-','+').gsub('_','/')
    encoded_str += '=' while !(encoded_str.size % 4).zero?
    Base64.decode64(encoded_str)
  end

  def decode_data str
    encoded_sig, payload = str.split('.')
    data = ActiveSupport::JSON.decode base64_url_decode(payload)
  end

end
