class AdminController < ApplicationController

  #before_filter :authenticate_user!

  DF_COORDS = [19.433333, -99.133333]
  DEFAULT_RADIUS = 0.2

  def index
  
  end

  def create_clue_mobile
    @clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
    @tickets = 1
	end

  def edit_clue_mobile
    @clue = Clue.find(params[:id])
    @tickets = @clue.tickets_not_assigned.count
    @disable_option = true
    render :create_clue_mobile
  end

  def create_clue_web
    @clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
    @tickets = 1
	end

  def edit_clue_web
    @clue = Clue.find(params[:id])
    @tickets = @clue.tickets_not_assigned.count
    @disable_option = true
    render :create_clue_web
  end

  def clues_list_web
    @clues = Clue.where("source_type = 'web'").order("active DESC, created_at DESC")
  end

  def clues_list_mobile
    @clues = Clue.where("source_type = 'mobile'").order("created_at DESC")
  end

	def users_referrals
		@referrals = Referral.find_top_referrers(20)
	end

  def reports

  end
end
