class MobileController < ApplicationController

  def index
    @has_ticket = current_user.ticket ? true : false;
  end

  def search_ticket
    lat = params[:lat]
    lng = params[:lng]
    result = {}
    
    result = Ticket.locate_and_assign(lat, lng, :mobile, current_user)
    
    render :json => result
  end

end
