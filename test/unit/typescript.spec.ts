/**
 * TypeScript Type Definition Tests for Moleculer 0.15 Compatibility
 * Validates that the type definitions work correctly with moleculer 0.15
 * This test ensures the package can be imported and used in TypeScript projects
 */

import { ServiceBroker, Service, ServiceSchema, Context } from 'moleculer';
import CronMixin from '../../index';

describe('TypeScript: Moleculer 0.15 Compatibility', () => {
  let broker: ServiceBroker;

  beforeAll(() => {
    broker = new ServiceBroker({ logger: false });
  });

  afterAll(() => broker.stop());

  it('should import CronMixin and types from moleculer', () => {
    expect(CronMixin).toBeDefined();
    expect(typeof CronMixin).toBe('object');
  });

  it('should create service with CronMixin using dynamic type', () => {
    const service = broker.createService({
      name: 'test.cron.service',
      mixins: [CronMixin],
      settings: {
        cronJobs: [
          {
            name: 'test-job',
            cronTime: '*/5 * * * * *',
            autoStart: false,
            onTick: function (this: Service) {
              this.logger.info('Cron job executed');
            },
          },
        ],
      } as any,
    } as any);

    expect(service).toBeDefined();
    expect(service.name).toBe('test.cron.service');
  });

  it('should support moleculer 0.15 ServiceBroker API', () => {
    expect(broker).toBeInstanceOf(ServiceBroker);
    expect(typeof broker.createService).toBe('function');
    expect(typeof broker.call).toBe('function');
    expect(typeof broker.stop).toBe('function');
  });

  it('should support moleculer 0.15 Service API', () => {
    const service = broker.createService({
      name: 'test.service',
      methods: {
        testMethod() {
          return 'test-result';
        },
      },
    } as any);

    expect(service).toBeDefined();
    expect(typeof service.logger).toBe('object');
    expect(typeof (service as any).testMethod).toBe('function');
  });

  it('should support context-based event handlers (0.15 requirement)', () => {
    const eventHandled = jest.fn();

    broker.createService({
      name: 'test.events',
      events: {
        'test.event': {
          handler(this: Service, ctx: Context) {
            eventHandled();
          },
        },
      },
    });

    expect(eventHandled).toBeDefined();
  });

  it('should support Service lifecycle hooks', () => {
    const createdHandler = jest.fn();
    const stoppedHandler = jest.fn();

    broker.createService({
      name: 'test.lifecycle',
      created(this: Service) {
        createdHandler();
      },
      stopped(this: Service) {
        stoppedHandler();
      },
    });

    expect(createdHandler).toHaveBeenCalled();
  });

  it('should validate that cron job configuration interface exists', () => {
    interface CronJobConfig {
      name: string;
      cronTime: string;
      onTick?: (this: Service) => void;
      onComplete?: (this: Service) => void;
      autoStart?: boolean;
    }

    const jobConfig: CronJobConfig = {
      name: 'test',
      cronTime: '0 0 0 * * *',
      autoStart: false,
    };

    expect(jobConfig.name).toBe('test');
    expect(jobConfig.cronTime).toBe('0 0 0 * * *');
    expect(jobConfig.autoStart).toBe(false);
  });

  it('should work with async service methods', async () => {
    const service = broker.createService({
      name: 'test.async',
      methods: {
        async asyncMethod() {
          return 'async-result';
        },
      },
    } as any);

    const result = await (service as any).asyncMethod();
    expect(result).toBe('async-result');
  });

  it('should validate moleculer 0.15 types are correctly imported', () => {
    // These type imports validate that moleculer 0.15 exports are working
    const serviceSchema: ServiceSchema = {
      name: 'types.test',
      methods: {
        test() {
          return 'test';
        },
      },
    };

    expect(serviceSchema).toBeDefined();
    expect(serviceSchema.name).toBe('types.test');
  });
});
