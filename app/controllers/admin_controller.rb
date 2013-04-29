class AdminController < ApplicationController

  authorize_resource :class => false

  DF_COORDS = [19.433333, -99.133333]
  DEFAULT_RADIUS = 0.2

  def logout
    reset_session
    redirect_to :signin
  end

  def index
    if not(current_user.try("roles") and current_user.role? :admin)
      reset_session
      redirect_to :signin
    end 
  end

  def create_clue_mobile
    @clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
    @tickets_assigned = 0
    @tickets_not_assigned = 1
	end

  def edit_clue_mobile
    @clue = Clue.find(params[:id])
    @tickets_not_assigned = @clue.tickets_not_assigned.count
    @tickets_assigned = @clue.tickets_assigned.count
    @disable_option = true
    render :create_clue_mobile
  end

  def create_clue_web
    @clue = Clue.new
    @clue.latitude = DF_COORDS[0]
    @clue.longitude = DF_COORDS[1]
    @clue.radius = DEFAULT_RADIUS
    @tickets_assigned = 0
    @tickets_not_assigned = 1
	end

  def edit_clue_web
    @clue = Clue.find(params[:id])
    @tickets_not_assigned = @clue.tickets_not_assigned.count
    @tickets_assigned = @clue.tickets_assigned.count
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
    @winners = Ticket.where("source_type = 'referrals'").count
	end

  def reports
    
  end

  def reports_summary
    @total_users = User.count
    @total_active_users = User.joins(:clues, :referrals).where("clues is not null or referrals is not null").count
    @total_referrals = Referral.count
    @accepted_referrals = Referral.where("accepted = ?", true).count
    @new_fans = User.select("DISTINCT(user_id)").joins(:activities).where("activity_id = 2").count
    @total_tickets = Ticket.count
    @assigned_tickets = Ticket.where("assigned = ?", true).count
    @total_clues = Clue.count
    @active_clues = Clue.where("active = ?", true).count
  end

  def reports_users

  end

end
