require 'test_helper'

class CluesControllerTest < ActionController::TestCase
  setup do
    @clue = clues(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:clues)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create clue" do
    assert_difference('Clue.count') do
      post :create, clue: { active: @clue.active, description: @clue.description, image_url: @clue.image_url, latitude: @clue.latitude, longitude: @clue.longitude, radius: @clue.radius }
    end

    assert_redirected_to clue_path(assigns(:clue))
  end

  test "should show clue" do
    get :show, id: @clue
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @clue
    assert_response :success
  end

  test "should update clue" do
    put :update, id: @clue, clue: { active: @clue.active, description: @clue.description, image_url: @clue.image_url, latitude: @clue.latitude, longitude: @clue.longitude, radius: @clue.radius }
    assert_redirected_to clue_path(assigns(:clue))
  end

  test "should destroy clue" do
    assert_difference('Clue.count', -1) do
      delete :destroy, id: @clue
    end

    assert_redirected_to clues_path
  end
end
