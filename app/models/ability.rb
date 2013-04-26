class Ability
  include CanCan::Ability

  def initialize(user)
	  user ||= User.new # guest user
    
    alias_action :create, :read, :update, :destroy, :to => :crud

    if user.role? :admin
      can :manage, :all
	  else
		  can :read, :all
      can :manage, :display
      can :manage, :mobile
      can [:create_batch, :accept], Referral
      can [:synch], User
      cannot :assign_to_user, Ticket
      cannot [:assign_tickets, :activate_web, :activate, :deactivate], Clue 
      cannot :manage, :admin
	  end
  end
end
