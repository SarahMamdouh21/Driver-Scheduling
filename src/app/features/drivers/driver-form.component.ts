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

  vehicleTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'truck', label: 'Truck' }
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
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      licenseNumber: ['', [Validators.required, Validators.minLength(6)]],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      vehicleType: ['sedan', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.driverForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitSuccess = false;

      const formData: CreateDriverRequest = this.driverForm.value;
      
      try {
        this.schedulingService.addDriver(formData);
        this.submitSuccess = true;
        this.driverForm.reset();
        this.initializeForm();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      } catch (error) {
        console.error('Error adding driver:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.driverForm.reset();
    this.initializeForm();
    this.submitSuccess = false;
    this.isSubmitting = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.driverForm.controls).forEach(key => {
      const control = this.driverForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.driverForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
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

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      licenseNumber: 'License Number',
      experience: 'Experience',
      vehicleType: 'Vehicle Type'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.driverForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
