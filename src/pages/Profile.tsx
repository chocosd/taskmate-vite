import { FormFieldType } from '@components/forms/form-field-types.enum';
import { type FormField } from '@components/forms/form-types.model';
import FormBuilder from '@components/forms/FormBuilder';
import { Validators } from '@components/forms/validators/validators';
import { isNumber } from '@utils/functions/is-number';
import { useState } from 'react';

const model: ProfileModel = {
    name: 'Alice Johnson',
    age: 28,
    gender: 'female',
    bio: 'Software developer from Toronto.',
    isAdmin: true,
};

export type ProfileModel = {
    name: string;
    age: 28;
    gender: string;
    bio: string;
    isAdmin: boolean;
};

const fields: FormField<ProfileModel>[] = [
    {
        name: 'name',
        type: FormFieldType.TEXTAREA,
        label: 'Full Name',
        validators: [Validators.required()],
        disabled: (form): boolean => {
            if (!isNumber(form.age)) {
                return false;
            }

            return form.age > 30;
        },
        config: {
            hint: 'Please enter your full name',
            rows: 1,
        },
    },
    {
        name: 'age',
        type: FormFieldType.NUMBER,
        label: 'Age',
        validators: [Validators.required(), Validators.min(18)],
        config: {
            hint: 'You must be 18 or older',
            min: 0,
        },
    },
    {
        name: 'gender',
        type: FormFieldType.SELECT,
        label: 'Gender',
        validators: [Validators.required()],
        options: [
            { label: 'Select Gender', value: '' },
            { label: 'Female', value: 'female' },
            { label: 'Male', value: 'male' },
            { label: 'Other', value: 'other' },
        ],
    },
    {
        name: 'bio',
        type: FormFieldType.TEXTAREA,
        label: 'Bio',
        config: {
            hint: 'Tell us a bit about yourself',
            rows: 3,
        },
    },
    {
        name: 'isAdmin',
        type: FormFieldType.CHECKBOX,
        label: 'Admin privileges',
    },
];

export default function ProfileForm() {
    const [profileData, setProfileData] = useState(model);

    const handleSubmit = (data: Record<string, unknown>) => {
        console.log('✅ Submitted Profile:', data);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-full">
            <h2 className="text-xl font-semibold mb-4">
                Edit Profile
            </h2>
            <FormBuilder
                fields={fields}
                model={profileData}
                updateModel={setProfileData}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
