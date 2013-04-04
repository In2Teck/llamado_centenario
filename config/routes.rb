TorreCentenario::Application.routes.draw do
  resources :activities

  resources :referrals do
    match 'create_batch', :on => :collection
    match 'accept', :on => :collection
  end

  resources :clues do
		match 'assign_tickets', :on => :collection
	end

  resources :tickets

  resources :roles

  devise_for :users, :controllers => {:omniauth_callbacks => "users/omniauth_callbacks"}

  devise_scope :user do
	  get 'logout', :to => "devise/sessions#destroy"
	  get 'signin', :to => "devise/sessions#new"
	  get 'signup', :to => "devise/registrations#new"
  end

  resources :users

	get 'admin/create_clue', :to => "admin#create_clue", :as => :admin_create_clue
	
  get 'admin/edit_clue/:id', :to => "admin#edit_clue", :as => :admin_edit_clue

	get 'admin/users_referrals', :to => "admin#users_referrals", :as => :admin_users_referrals

	match 'users/:id/assign_ticket' => 'users#assign_ticket', :as => :users_assign_ticket

  match 'search_clue' => 'display#search_clue', :as => :search_clue

  match 'make_guess' => 'display#make_guess', :as => :make_guess

  match 'invite_friends' => 'display#invite_friends', :as => :invite_friends

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'display#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
