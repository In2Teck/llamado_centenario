class AdminController < ApplicationController
  DF_COORDS = [19.433333, -99.133333]
  DEFAULT_RADIUS = 3

	def create_clue
		@clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
	end

	def users_referrals
		@users = User.find_top_referrers(20)
	end

end
