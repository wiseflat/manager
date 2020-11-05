import get from 'lodash/get';

export default class TechnicalDetails {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  formattedRAM() {
    const ram = get(this.technicalDetails, 'server.memory');
    if (!ram) {
      return '-';
    }
    const sizeUnit = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_size_unit',
    );
    const freqUnit = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_ram_frequency_unit',
    );
    const ramSize = ram.size ? `${ram.size} ${sizeUnit}` : '';
    const ramType = get(ram, 'type', '');
    const ramECC = ram.ecc ? 'ECC' : '';
    const ramFrequency = ram.frequency ? `${ram.frequency} ${freqUnit}` : '';
    return `${ramSize} ${ramType} ${ramECC} ${ramFrequency}`;
  }

  formattedCPU() {
    const cpu = get(this.technicalDetails, 'server.cpu');
    if (!cpu) {
      return '-';
    }
    const freqUnit = this.$translate.instant(
      'dedicated_server_dashboard_technical_details_cpu_frequency_unit',
    );
    const cpuBrand = get(cpu, 'brand', '');
    const cpuModel = get(cpu, 'model', '');
    const cpuCores = cpu.cores ? `${cpu.cores}c` : '';
    const cpuThreads = cpu.threads ? `${cpu.cores && '/'}${cpu.threads}t` : '';
    const cpuFrequency = cpu.frequency ? `${cpu.frequency} ${freqUnit}` : '';
    const cpuBoost =
      cpu.boost !== cpu.frequency ? `/${cpu.boost} ${freqUnit}` : '';
    return `${cpuBrand} ${cpuModel} - ${cpuCores}${cpuThreads} - ${cpuFrequency}${cpuBoost}`;
  }
}
