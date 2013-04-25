class Ability
  include CanCan::Ability

  def initialize(user)
	  user ||= User.new # guest user
    
    alias_action :create, :read, :update, :destroy, :to => :crud

    if user.role? :admin
      can :manage, :all
	  else
		  can :read, :all
      
	  end
  end
end
