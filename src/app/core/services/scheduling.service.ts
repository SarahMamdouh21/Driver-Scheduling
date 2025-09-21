import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SchedulingService } from '../../core/services/scheduling.service';
import { CreateDriverRequest } from '../../core/interfaces';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driver-form.component.html',
  styleUrl: './driver-form.component.scss'
})
export class DriverFormComponent implements OnInit {
  driverForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  errorMessage = '';

  vehicleTypes = [
    { value: 'Heavy Truck', label: 'Heavy Truck' },
    { value: 'Delivery Van', label: 'Delivery Van' },
    { value: 'Refrigerated Truck', label: 'Refrigerated Truck' },
    { value: 'Box Truck', label: 'Box Truck' },
    { value: 'Flatbed Truck', label: 'Flatbed Truck' }
  ];

  constructor(
    private fb: FormBuilder,
    private schedulingService: SchedulingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.driverForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(6)]],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      vehicleType: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    
    if (this.driverForm.invalid) {
      this.markAllFormFieldsAsTouched();
      this.isSubmitting = false;
      return;
    }

    try {
      const driverData: CreateDriverRequest = this.driverForm.value;
      this.schedulingService.addDriver(driverData);
      this.submitSuccess = true;
      this.resetForm();
      console.log('Driver added successfully:', driverData);
    } catch (error) {
      this.errorMessage = 'Failed to add driver. Please try again.';
      console.error('Error adding driver:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.driverForm.reset();
    this.submitSuccess = false;
    this.isSubmitting = false;
    this.errorMessage = '';
  }

  markAllFormFieldsAsTouched(): void {
    Object.values(this.driverForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.driverForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `This field is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (control.errors['min']) {
        return 'Experience must be at least 0 years';
      }
      if (control.errors['max']) {
        return 'Experience cannot exceed 50 years';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.driverForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
}