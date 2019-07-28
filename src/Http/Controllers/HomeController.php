<?php

namespace Eav\Dashboard\Http\Controllers;

use Eav\Dashboard\Http\Middleware\Authenticate;
use Illuminate\Routing\Controller as BaseController;

class HomeController extends BaseController
{
	/**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(Authenticate::class);
    }
    /**
     * Single page application catch-all route.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('eav-dashboard::app');
    }
}