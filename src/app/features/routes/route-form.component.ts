import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SchedulingService } from '../../core/services/scheduling.service';
import { CreateRouteRequest } from '../../core/interfaces';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss'
})
export class RouteFormComponent implements OnInit {
  routeForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  vehicleTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'van', label: 'Van' },
    { value: 'truck', label: 'Truck' }
  ];

  priorities = [
    { value: 'low', label: 'Low', color: '#27ae60' },
    { value: 'medium', label: 'Medium', color: '#f39c12' },
    { value: 'high', label: 'High', color: '#e74c3c' }
  ];

  constructor(
    private fb: FormBuilder,
    private schedulingService: SchedulingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    this.routeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      startLocation: ['', [Validators.required, Validators.minLength(3)]],
      endLocation: ['', [Validators.required, Validators.minLength(3)]],
      distance: ['', [Validators.required, Validators.min(0.1), Validators.max(1000)]],
      estimatedDuration: ['', [Validators.required, Validators.min(5), Validators.max(480)]],
      priority: ['medium', Validators.required],
      scheduledDate: [tomorrow.toISOString().slice(0, 16), Validators.required],
      vehicleType: ['sedan', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.routeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitSuccess = false;

      const formData = this.routeForm.value;
      const routeData: CreateRouteRequest = {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate)
      };
      
      try {
        this.schedulingService.addRoute(routeData);
        this.submitSuccess = true;
        this.routeForm.reset();
        this.initializeForm();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      } catch (error) {
        console.error('Error adding route:', error);
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  public resetForm(): void {
    // Reset form to initial state
    this.routeForm.reset();
    this.initializeForm();
    this.submitSuccess = false;
    this.isSubmitting = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.routeForm.controls).forEach(key => {
      const control = this.routeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.routeForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        const min = control.errors['min'].min;
        if (fieldName === 'distance') {
          return `Distance must be at least ${min} km`;
        } else if (fieldName === 'estimatedDuration') {
          return `Duration must be at least ${min} minutes`;
        }
        return `Value must be at least ${min}`;
      }
      if (control.errors['max']) {
        const max = control.errors['max'].max;
        if (fieldName === 'distance') {
          return `Distance cannot exceed ${max} km`;
        } else if (fieldName === 'estimatedDuration') {
          return `Duration cannot exceed ${max} minutes`;
        }
        return `Value cannot exceed ${max}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Route Name',
      startLocation: 'Start Location',
      endLocation: 'End Location',
      distance: 'Distance',
      estimatedDuration: 'Estimated Duration',
      priority: 'Priority',
      scheduledDate: 'Scheduled Date',
      vehicleType: 'Vehicle Type',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.routeForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  getPriorityColor(priority: string): string {
    const priorityObj = this.priorities.find(p => p.value === priority);
    return priorityObj?.color || '#95a5a6';
  }
}
