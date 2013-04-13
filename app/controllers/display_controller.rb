class DisplayController < ApplicationController

  #before_filter :authenticate_user!

  def index
    @signed_request = params[:signed_request]
    @app_data = (decode_data @signed_request)["app_data"] if not @signed_request.blank?
	end

  def search_clue
    @active_clue
    clues = Clue.active_to_user(:web)
    @active_clue = clues[0]
    @can_guess = current_user.clues.length == 0 ? true : false
  end

  def make_guess
    lat = params[:lat]
    lng = params[:lng]
    result = {}
    if (current_user.clues.length == 0)
      guess = Ticket.locate_and_assign(lat, lng, :web, current_user)
      result = {:result => guess}
    else
      result = {:error => true}
    end
    render :json => result
  end

  def invite_friends
    @no_referrals = current_user.referrals.blank?
    if not @no_referrals
      @referrals = current_user.referrals.includes(:user)
    end
  end

  def terms_and_conditions
    @authorized = params[:authorized]
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
