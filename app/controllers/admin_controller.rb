class AdminController < ApplicationController
	def create_clue
		@clue = Clue.new
	end

	def users_referrals
		@users = User.find_top_referrers(20)
	end

end
