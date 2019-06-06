<?php

namespace Eav\Dashboard;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider as IlluminateServiceProvider;

class ServiceProvider extends IlluminateServiceProvider
{
	/**
     * Bootstrap any package services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadViewsFrom(
            __DIR__.'/../resources/views', 'eav-dashboard'
        );

        if ($this->app->runningInConsole()) {

            $this->publishes([
                __DIR__.'/../public' => public_path('vendor/eav-dashboard'),
            ], 'eav-dashboard-assets');

            $this->publishes([
                __DIR__.'/../config/eav-dashboard.php' => config_path('eav-dashboard.php'),
            ], 'eav-dashboard-config');

        }
    }

     /**
     * Register any package services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerRoutes();

        /*$this->mergeConfigFrom(
            __DIR__.'/../config/eav-dashboard.php', 'eav-dashboard'
        );*/

        $this->commands([
            Console\PublishCommand::class,
        ]);
    }


    /**
     * Register the Horizon routes.
     *
     * @return void
     */
    protected function registerRoutes()
    {
        Route::group([
            'prefix' => config('eav.uri', 'eav/dashboard'),
            'namespace' => 'Eav\Dashboard\Http\Controllers',
            'middleware' => config('eav.web.middleware', 'web'),
            'as' => 'eav.'
        ], function () {
            $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        });
    }
}