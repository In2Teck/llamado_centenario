class DisplayController < ApplicationController

  def index
	end

  def search_clue
    @active_clue
    clues = Clue.active_to_user(:web)
    @active_clue = clues[0]
  end

  def make_guess
    lat = params[:lat]
    lng = params[:lng]
    guess = Ticket.locate_and_assign(lat, lng, :web, current_user)
    render :json => {:result => guess}
  end

end
