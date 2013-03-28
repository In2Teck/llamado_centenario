class AdminController < ApplicationController
  DF_COORDS = [19.433333, -99.133333]
  DEFAULT_RADIUS = 3

	def create_clue
		@clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
    @tickets = 0
	end

  def edit_clue
    @clue = Clue.find(params[:id])
    @tickets = @clue.tickets_not_assigned.count
    @disable_option = true
    render :create_clue
  end

  def active_clues
		@clues = Clue.find_all_by_active(true)
  end

	def users_referrals
		@users = User.find_top_referrers(20)
	end

end
