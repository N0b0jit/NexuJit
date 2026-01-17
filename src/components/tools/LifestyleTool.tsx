import UnitConverter from '@/components/tools/UnitConverter';

export default function LifestyleTool(props: any) {
    return <UnitConverter {...props} type="digital" title="Digital Converter" description="Convert between bits, bytes, kilobytes, megabytes, etc." />;
}
