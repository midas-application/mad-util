var animate = madutil.animate = (function() {
	var prefix = '', eventPrefix, endEventName, endAnimationName,
		vendors = {Webkit: 'webkit', Moz: '', O: 'o'},
		document = window.document, testEl = document.createElement('div'),
		supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		transform,
		transitionProperty, transitionDuration, transitionTiming, transitionDelay,
		animationName, animationDuration, animationTiming, animationDelay,
		cssReset = {};
	function normalizeEvent(name) {
		return eventPrefix ? eventPrefix + name : name.toLowerCase()
	}

	fn.each(vendors, function (event, vendor) {
		if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
			prefix = '-' + vendor.toLowerCase() + '-';
			eventPrefix = event;
			return false
		}
	})

	transform = prefix + 'transform'
	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
			cssReset[transitionDelay = prefix + 'transition-delay'] =
				cssReset[transitionTiming = prefix + 'transition-timing-function'] =
					cssReset[animationName = prefix + 'animation-name'] =
						cssReset[animationDuration = prefix + 'animation-duration'] =
							cssReset[animationDelay = prefix + 'animation-delay'] =
								cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

	return function (dom, properties, duration, ease, callback, delay) {
		if (lang.isFunction(duration))
			callback = duration, ease = undefined, duration = undefined
		if (lang.isFunction(ease))
			callback = ease, ease = undefined
		if (lang.isObject(duration))
			ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
		if (duration) duration = (typeof duration == 'number' ? duration :
			($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
		if (delay) delay = parseFloat(delay) / 1000
		return anim.call(dom, properties, duration, ease, callback, delay)
	}

	aminate.fx = {
		off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
		speeds: {_default: 400, fast: 200, slow: 600},
		cssPrefix: prefix,
		transitionEnd: normalizeEvent('TransitionEnd'),
		animationEnd: normalizeEvent('AnimationEnd')
	}

	var anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {}, cssProperties, transforms = '',
			that = this, wrappedCallback, endEvent = aminate.fx.transitionEnd,
			fired = false

		if (duration === undefined) duration = aminate.fx.speeds._default / 1000
		if (delay === undefined) delay = 0
		if (aminate.fx.off) duration = 0

		if (typeof properties == 'string') {
			// keyframe animation
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (ease || 'linear')
			endEvent = aminate.fx.animationEnd
		} else {
			cssProperties = []
			// CSS transitions
			for (key in properties)
				if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
				else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

			if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ')
				cssValues[transitionDuration] = duration + 's'
				cssValues[transitionDelay] = delay + 's'
				cssValues[transitionTiming] = (ease || 'linear')
			}
		}

		wrappedCallback = function (event) {
			if (typeof event !== 'undefined') {
				if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
				event.unon(event.target, endEvent, wrappedCallback)
			} else
				event.unon(this, endEvent, wrappedCallback) // triggered by setTimeout

			fired = true
			dom.css(this, cssReset);
			callback && callback.call(this)
		}
		if (duration > 0) {
			event.on(this, endEvent, wrappedCallback)
			// transitionEnd is not always firing on older Android phones
			// so make sure it gets fired
			setTimeout(function () {
				if (fired) return
				wrappedCallback.call(that)
			}, (duration * 1000) + 25)
		}

		// trigger page reflow so new elements can animate
		this.clientLeft

		dom.css(this, cssValues);

		if (duration <= 0) setTimeout(function () {
			wrappedCallback.call(that)
		}, 0)
	}

	testEl = null
})();