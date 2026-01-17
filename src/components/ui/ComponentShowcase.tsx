'use client';

import { useState } from 'react';
import { Download, Settings, Trash2, Heart } from 'lucide-react';
import {
  Reveal,
  Card,
  Badge,
  Button,
  Input,
  Textarea,
  Select,
  Tabs,
  Modal,
  Tooltip,
  Divider,
  Switch,
  Checkbox,
  Radio,
  Progress,
  Spinner,
  Skeleton,
} from './index';

/**
 * Component showcase - demonstrates all UI components
 * Use this as a reference for implementation
 */
export default function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [activeTab, setActiveTab] = useState('components');

  const tabs = [
    { id: 'components', label: 'Components' },
    { id: 'forms', label: 'Forms' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <div className="page-container py-20">
      <Reveal>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-fg-primary to-fg-secondary bg-clip-text text-transparent">
            Component Showcase
          </h1>
          <p className="text-fg-secondary text-lg">
            Comprehensive UI component library for SEOStudio
          </p>
        </div>
      </Reveal>

      <Tabs tabs={tabs} activeTab={activeTab} setTab={setActiveTab} />

      {activeTab === 'components' && (
        <div className="space-y-12">
          {/* Cards & Badges */}
          <Reveal delay={0.1}>
            <Card>
              <h3 className="text-2xl font-bold mb-6">Cards & Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover>
                  <h4 className="font-bold mb-2">Hover Card</h4>
                  <p className="text-fg-secondary text-sm">
                    This card has hover effects
                  </p>
                </Card>
                <Card hover={false}>
                  <h4 className="font-bold mb-2">Static Card</h4>
                  <p className="text-fg-secondary text-sm">
                    This card has no hover effect
                  </p>
                </Card>
                <Card padding="p-8">
                  <h4 className="font-bold mb-2">Large Padding</h4>
                  <p className="text-fg-secondary text-sm">
                    Custom padding applied
                  </p>
                </Card>
              </div>

              <Divider label="Badges" className="my-8" />

              <div className="flex flex-wrap gap-3">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </Card>
          </Reveal>

          {/* Buttons */}
          <Reveal delay={0.2}>
            <Card>
              <h3 className="text-2xl font-bold mb-6">Buttons</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-fg-secondary">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-3 text-fg-secondary">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-3 text-fg-secondary">States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Tooltip content="Click to download">
                      <Button>
                        <Download size={16} />
                        With Icon
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      )}

      {activeTab === 'forms' && (
        <div className="space-y-12">
          {/* Form Inputs */}
          <Reveal delay={0.1}>
            <Card>
              <h3 className="text-2xl font-bold mb-6">Form Inputs</h3>
              
              <div className="space-y-6 max-w-2xl">
                <Input 
                  label="Email Address" 
                  placeholder="Enter your email"
                  type="email"
                  helperText="We'll never share your email"
                />

                <Input 
                  label="Password" 
                  placeholder="Enter password"
                  type="password"
                  error="Password must be at least 8 characters"
                />

                <Textarea
                  label="Description"
                  placeholder="Write something..."
                  helperText="Maximum 500 characters"
                />

                <Select
                  label="Choose Option"
                  options={[
                    { value: '', label: 'Select an option' },
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                  ]}
                />

                <Divider />

                <div className="space-y-4">
                  <Switch 
                    checked={switchChecked} 
                    onChange={setSwitchChecked}
                    label="Enable notifications"
                  />

                  <Checkbox
                    checked={checkboxChecked}
                    onChange={setCheckboxChecked}
                    label="I agree to the terms and conditions"
                  />

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-fg-primary">Choose your plan:</p>
                    <Radio
                      name="plan"
                      value="option1"
                      checked={radioValue === 'option1'}
                      onChange={setRadioValue}
                      label="Free Plan"
                    />
                    <Radio
                      name="plan"
                      value="option2"
                      checked={radioValue === 'option2'}
                      onChange={setRadioValue}
                      label="Pro Plan"
                    />
                    <Radio
                      name="plan"
                      value="option3"
                      checked={radioValue === 'option3'}
                      onChange={setRadioValue}
                      label="Enterprise Plan"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-12">
          {/* Progress & Loading */}
          <Reveal delay={0.1}>
            <Card>
              <h3 className="text-2xl font-bold mb-6">Progress & Loading</h3>
              
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h4 className="font-semibold text-sm mb-4 text-fg-secondary">Progress Bars</h4>
                  <div className="space-y-4">
                    <Progress value={30} showLabel />
                    <Progress value={65} variant="success" showLabel />
                    <Progress value={90} variant="danger" showLabel />
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="font-semibold text-sm mb-4 text-fg-secondary">Spinners</h4>
                  <div className="flex items-center gap-6">
                    <Spinner size="xs" />
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                    <Spinner size="xl" variant="accent" />
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="font-semibold text-sm mb-4 text-fg-secondary">Skeletons</h4>
                  <div className="space-y-4">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                    <div className="flex items-center gap-4">
                      <Skeleton variant="circular" width={48} height={48} />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="80%" />
                      </div>
                    </div>
                    <Skeleton variant="rectangular" height={200} />
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Modal & Tooltips */}
          <Reveal delay={0.2}>
            <Card>
              <h3 className="text-2xl font-bold mb-6">Overlays</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-fg-secondary">Modal</h4>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Settings size={16} />
                    Open Modal
                  </Button>

                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Settings"
                    size="md"
                  >
                    <div className="space-y-4">
                      <p className="text-fg-secondary">
                        This is a modal dialog. You can put any content here.
                      </p>
                      <Input label="Username" placeholder="Enter username" />
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setIsModalOpen(false)}>
                          Save Changes
                        </Button>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>

                <Divider />

                <div>
                  <h4 className="font-semibold text-sm mb-3 text-fg-secondary">Tooltips</h4>
                  <div className="flex flex-wrap gap-4">
                    <Tooltip content="This is a top tooltip" position="top">
                      <Button size="sm">Top</Button>
                    </Tooltip>
                    <Tooltip content="This is a right tooltip" position="right">
                      <Button size="sm">Right</Button>
                    </Tooltip>
                    <Tooltip content="This is a bottom tooltip" position="bottom">
                      <Button size="sm">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="This is a left tooltip" position="left">
                      <Button size="sm">Left</Button>
                    </Tooltip>
                    <Tooltip content="Like this feature!" position="top">
                      <Button size="sm" variant="danger">
                        <Heart size={14} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      )}
    </div>
  );
}