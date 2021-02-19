class TokenBucket {
  constructor(capacity, fillPerSecond) {
    this.capacity = capacity;
    this.fillPerSecond = fillPerSecond;
    this.lastFilled = Math.floor(Date.now() / 1000);
    this.tokens = capacity;
  }

  async take() {
    // Calculate how many tokens (if any) should have been added since the last request
    await this.refill();
    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    } else {
      await new Promise(r => setTimeout(r, (Date.now()-(this.lastFilled*1000)+this.fillPerSecond)))
    }
  }

  async refill() {
    const now = Math.floor(Date.now() / 1000); // convert into sec
    const rate = (now - this.lastFilled) / this.fillPerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + Math.floor(rate * this.capacity));
    if(this.tokens){
      this.lastFilled = now;
    }
  }
}

export default (maxBurst, perSecond) => {
  return new TokenBucket(maxBurst, perSecond)
}

