class DisplayController < ApplicationController

  authorize_resource :class => false

  def index
    @signed_request = params[:signed_request]
    @app_data = (decode_data @signed_request)["app_data"] if not @signed_request.blank?
    @is_fan = (decode_data @signed_request)["page"]["liked"] if not @signed_request.blank?
    @is_fan = current_user.is_fan if @signed_request.blank? && current_user != nil
	end

  def search_clue
    if current_user
      clues = Clue.active_to_user(:web)
      @has_ticket = (current_user && current_user.ticket) ? true : false
      @active_clue = clues[0]
      @can_guess = (current_user.clues.where('clue_id = ?',  @active_clue[:id]).length == 0 ? true : false) if @active_clue
      # HACK: para no traer al admin user id != 1
      @players = User.where("current_sign_in_at is not null and id != 1").order("current_sign_in_at DESC").limit(10).reverse
    else
      redirect_to :root
    end
  end

  def make_guess
    lat = params[:lat]
    lng = params[:lng]
    clue_id = params[:clue_id]
    result = {}
    if (current_user.clues.where('clue_id = ?', clue_id).length == 0)
      result = Ticket.locate_and_assign(lat, lng, :web, current_user)
    else
      result = {:won_ticket => false, :error => true, :code => 2}
    end
    render :json => result
  end

  def check_availability
    clues = Clue.active_to_user(:web)
    result = {:result => false}
    if (clues.length > 0)
      # HACK: para no traer al admin user id != 1
      @players = User.where("current_sign_in_at is not null and id != 1").order("current_sign_in_at DESC").limit(10).reverse
      result = {:result => true, :clue => clues[0], :players => @players}
    end
    render :json => result
  end

  def invite_friends
    if current_user
      @has_ticket = current_user.ticket ? true : false
      @referrals = current_user.referrals.includes(:referred).where("referrals.accepted = ?", true)
    else
      redirect_to :root
    end
  end
  
  def fun_facts

  end

  def martin_facts

  end

  def youtube_channel

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
