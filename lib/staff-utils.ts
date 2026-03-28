type UserRole = 'STAFF' | 'MANAGE' | 'CUSTOMER';

export function getBadgeVariant(role: UserRole): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case 'MANAGE':
      return 'default';
    case 'STAFF':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'MANAGE':
      return 'Manager';
    case 'STAFF':
      return 'Staff';
    case 'CUSTOMER':
      return 'Customer';
    default:
      return 'Unknown';
  }
}

export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}
