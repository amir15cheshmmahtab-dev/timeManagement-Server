/**
 * Bootstrap your App
 *
 */

// import os from 'os';
import cluster from 'cluster';

import App from '@providers/App';
import NativeEvent from '@exceptions/NativeEvent';
import 'reflect-metadata';

if (process.env.NODE_ENV == 'test') {
  /**
   * Catches the process events
   */
  NativeEvent.process();
  /**
   * Load Configuration
   */
  App.loadConfiguration();
  /**
   * Running the server with the test server
   */
  App.loadServer();
} else {
  if (cluster.isPrimary) {
    /**
     * Catches the process events
     */
    NativeEvent.process();

    /**
     * Clear the console before the app runs
     */
    App.clearConsole();

    /**
     * Load Configuration
     */
    App.loadConfiguration();

    /**
     * Find the number of available CPUS
     */
    // const CPUS = os.cpus();

    /**
     * Fork the process, the number of times we have CPUs available
     */

    // TODO: Make this configurable for number of cpus to use
    for (let i = 0; i < 1; i++) {
      cluster.fork();
    }

    /**
     * Catches the cluster events
     */
    NativeEvent.cluster(cluster);

    /**
     * Run the Worker every minute
     * Note: we normally start worker after
     * the entire app is loaded
     */
    // setTimeout(() => App.loadWorker(), 1000 * 60);
  } else {
    /**
     * Run the Database pool
     */

    App.loadDatabase();

    /**
     * Run the Server on Clusters
     */
    App.loadServer();
  }
}
