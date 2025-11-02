import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { UserProfile } from '../types';
import { Button, Input, CheckboxGroup, RadioGroup, TextArea } from '../components/common';
import { ArrowLeftIcon } from '../components/icons';

const onboardingSteps = [
  { id: 'basic', title: 'About You' },
  { id: 'interests', title: 'Your Travel Style' },
  { id: 'accessibility', title: 'Your Accessibility Needs' },
  { id: 'preferences', title: 'Final Preferences' },
];

// Options for form fields
const travelStyles = ['cultural', 'adventure', 'relaxation', 'business', 'family', 'solo', 'accessible'] as const;
const budgetRanges = ['budget', 'mid-range', 'luxury', 'flexible'] as const;
const accommodationPrefs = ['Hotel (Chain)', 'Boutique Hotel', 'Vacation Rental', 'Accessible Resort', 'Hostel'] as const;
const mobilityNeedsOptions = ['Wheelchair accessible ramps', 'Elevator access', 'Step-free entrances', 'Accessible parking', 'Roll-in shower', 'Grab bars in bathroom'] as const;
const sensoryNeedsOptions = ['Low-sensory environments', 'Hearing loops / Induction loops', 'Braille signage', 'Audio descriptions', 'Fragrance-free rooms'] as const;
const communicationStyles = ['brief', 'detailed', 'conversational', 'professional'] as const;


const OnboardingPage: React.FC = () => {
    const { profile, updateProfile, loading } = useUser();
    const [step, setStep] = useState(0);
    
    // The profile from context is the source of truth, but we use local form state for edits.
    const [formData, setFormData] = useState<UserProfile | null>(profile);

    // Sync local state if profile loads from context after component mounts
    React.useEffect(() => {
        if (profile) {
            setFormData(profile);
        }
    }, [profile]);

    if (loading) return <div>Loading...</div>;
    if (!profile || !formData) {
        window.location.hash = '#/';
        return null;
    }

    const handleUpdate = (path: string, value: any) => {
        setFormData(prev => {
            if (!prev) return null;
            const keys = path.split('.');
            // Deep copy to avoid mutation
            const newState = JSON.parse(JSON.stringify(prev));
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] = current[keys[i]] || {};
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };
    
    const saveAndProceed = (nextStep: number) => {
        updateProfile(formData);
        if (nextStep < onboardingSteps.length) {
            setStep(nextStep);
        }
    };
    
    const finish = () => {
        updateProfile({ ...formData, onboarding_completed: true, profile_complete: true });
        window.location.hash = '#/chat';
    };
    
    const currentStep = onboardingSteps[step];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 transition-all duration-500">
            <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-xl shadow-lg">
                 <div className="mb-8">
                    {step > 0 && <button onClick={() => saveAndProceed(step - 1)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"><ArrowLeftIcon className="w-4 h-4" /> Back</button>}
                    <h2 className="text-2xl font-bold text-gray-900">{currentStep.title}</h2>
                    <p className="text-gray-500">Step {step + 1} of {onboardingSteps.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={onboardingSteps.length} aria-label={`Step ${step + 1} of ${onboardingSteps.length}`}>
                        <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / onboardingSteps.length) * 100}%` }}></div>
                    </div>
                </div>

                <div className="space-y-6" role="main" id="main-content">
                    {step === 0 && (
                        <>
                            <Input id="name" label="Full Name" value={formData.basic_info.name} onChange={e => handleUpdate('basic_info.name', e.target.value)} />
                             <Input id="age" label="Age" type="number" value={formData.basic_info.age || ''} onChange={e => handleUpdate('basic_info.age', parseInt(e.target.value, 10) || undefined)} />
                            <Input id="nationality" label="Nationality" value={formData.basic_info.nationality} onChange={e => handleUpdate('basic_info.nationality', e.target.value)} placeholder="e.g. American" />
                            <Input id="home_location" label="Home City / Location" value={formData.basic_info.home_location} onChange={e => handleUpdate('basic_info.home_location', e.target.value)} placeholder="e.g. San Francisco, CA" />
                        </>
                    )}
                    {step === 1 && (
                        <>
                           <RadioGroup legend="Budget Range" name="budget" options={budgetRanges} selectedValue={formData.travel_interests.budget_range} onChange={v => handleUpdate('travel_interests.budget_range', v)} />
                           <CheckboxGroup legend="Travel Style" options={travelStyles} selectedOptions={formData.travel_interests.travel_style} onChange={v => handleUpdate('travel_interests.travel_style', v)} />
                           <CheckboxGroup legend="Accommodation Preferences" options={accommodationPrefs} selectedOptions={formData.travel_interests.accommodation_preferences} onChange={v => handleUpdate('travel_interests.accommodation_preferences', v)} />
                           <TextArea id="destinations" label="Preferred Destinations (optional)" value={(formData.travel_interests.preferred_destinations || []).join(', ')} onChange={e => handleUpdate('travel_interests.preferred_destinations', e.target.value.split(',').map(s => s.trim()))} placeholder="Paris, Tokyo, Costa Rica..." />
                        </>
                    )}
                    {step === 2 && (
                         <>
                           <CheckboxGroup legend="Mobility Needs" options={mobilityNeedsOptions} selectedOptions={formData.accessibility_profile.mobility_needs} onChange={v => handleUpdate('accessibility_profile.mobility_needs', v)} />
                           <CheckboxGroup legend="Sensory Needs" options={sensoryNeedsOptions} selectedOptions={formData.accessibility_profile.sensory_needs} onChange={v => handleUpdate('accessibility_profile.sensory_needs', v)} />
                           <TextArea id="mobility-aids" label="Mobility Aids You Use (optional)" value={(formData.accessibility_profile.mobility_aids || []).join(', ')} onChange={e => handleUpdate('accessibility_profile.mobility_aids', e.target.value.split(',').map(s => s.trim()))} placeholder="Power wheelchair, white cane..." />
                        </>
                    )}
                     {step === 3 && (
                        <>
                            <RadioGroup legend="Preferred Communication Style from AI" name="comm-style" options={communicationStyles} selectedValue={formData.preferences.communication_style} onChange={v => handleUpdate('preferences.communication_style', v)} />
                             <div className="p-4 border rounded-lg">
                                <label className="flex items-center cursor-pointer">
                                     <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked={!!formData.accessibility_profile.service_animal} onChange={e => handleUpdate('accessibility_profile.service_animal', e.target.checked ? { type: '', name: '', documentation: false } : undefined)} />
                                     <span className="ml-3 text-sm font-medium text-gray-700">I travel with a service animal</span>
                                </label>
                                {formData.accessibility_profile.service_animal && (
                                    <div className="mt-4 space-y-4 pl-8 border-l ml-2">
                                        <Input id="sa-type" label="Animal Type" value={formData.accessibility_profile.service_animal.type} onChange={e => handleUpdate('accessibility_profile.service_animal.type', e.target.value)} placeholder="e.g., Guide Dog" />
                                        <Input id="sa-name" label="Animal Name" value={formData.accessibility_profile.service_animal.name} onChange={e => handleUpdate('accessibility_profile.service_animal.name', e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    {step < onboardingSteps.length - 1 ? (
                        <Button onClick={() => saveAndProceed(step + 1)}>Next Step</Button>
                    ) : (
                        <Button onClick={finish}>Finish & Start Planning</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
