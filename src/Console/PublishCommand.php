<?php

namespace Eav\Dashboard\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class PublishCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'eav-dash:publish {--clean : Remove any existing files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish all of the EAV Dashboard resources';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        if($this->option('clean')) {
            $filesystem = new Filesystem();
            $filesystem->deleteDirectory(public_path('vendor/eav-dashboard/'));
        }

        $this->call('vendor:publish', [
            '--tag' => 'eav-dashboard-assets',
            '--force' => true,
        ]);
    }
}